from fastapi import FastAPI, Query
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import os
import pandas as pd
import numpy as np
import re

app = FastAPI()


origins = [
    "http://localhost:3000",  
    "https://jkirklab.github.io" 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).parent.parent

try:
    df_60 = pd.read_excel(BASE_DIR / "backend" / "data" / "Nano_vs_Flat_Day60.xlsx")
    df_time_var = pd.read_excel(BASE_DIR / "backend" / "data" / "regnier_all_combined_wpval.xlsx")
    print("Data Loaded")
except Exception as e:
    print(" Failed to load data:", e)

@app.get("/api/wakeup")
def wakeup():
    return {"status": "I'm awake!"}

@app.get("/api/proteins_60")
def get_proteins_60():
    df = df_60[["Gene Symbol", "Accession"]].dropna().drop_duplicates()
    df["display"] = df["Gene Symbol"] + " (" + df["Accession"] + ")"
    return df[["display"]].to_dict(orient="records")

@app.get("/api/proteins_var")
def get_proteins_var():
    df = df_time_var[["Gene Symbol", "Accession"]].dropna().drop_duplicates()
    df["display"] = df["Gene Symbol"] + " (" + df["Accession"] + ")"
    return df[["display"]].to_dict(orient="records")

@app.get("/api/proteins_time")
def get_proteins_time(time: str):

    mutant = f"({time}, mutant)"
    control = f"({time}, control)"
    
    expected_columns = [
        f"Abundance Ratio: {mutant} / {control}",
        f"Abundance Ratio P-Value: {mutant} / {control}"
    ]
    matching_columns = [col for col in expected_columns if col in df_time_var.columns]

    if not matching_columns:
        return []
    
    filtered_df = df_time_var[df_time_var[matching_columns].notna().any(axis=1)]

    df = filtered_df[["Gene Symbol", "Accession"]].dropna().drop_duplicates()
    df["display"] = df["Gene Symbol"] + " (" + df["Accession"] + ")"
    return df[["display"]].to_dict(orient="records")

@app.get("/api/data")
def get_data(protein: str = Query(...)):

    accession = protein.split(" (")[1][:-1]
    row = df_time_var[df_time_var["Accession"] == accession]

    if row.empty:
        return []
    
    pattern = r"Abundances \(Grouped\): (\d+), (mutant|control)$"
    matched = []
    for col in df_time_var.columns:
        m = re.match(pattern, col)
        if m:
            time = int(m.group(1))
            condition = m.group(2)
            cv_col = f"Abundances (Grouped) CV [%]: {time}, {condition}"
            matched.append((col, cv_col, int(m.group(1)), m.group(2)))

    if not matched:
        return []
    

    data = []
    for abundance_col, cv_col, time, condition in matched:
        mean = row[abundance_col].values[0]
        cv = row[cv_col].values[0]
        n = 3 
        if pd.notna(cv) and mean:
            sem = (cv / 100) * (mean / np.sqrt(n))
        else:
            sem = 0
        data.append({"time": time,
                     "condition": condition,
                     "abundance": mean,
                     "sem": sem
                     })
        
    df = pd.DataFrame(data)
    ref = df.query("time == 5 and condition == 'control'")
    factor = ref["abundance"].values[0] if not ref.empty else 1.0

    df["abundance"] = df["abundance"] / factor
    df["sem"] = df["sem"] / factor

    df = df.dropna(subset=["abundance"])
    df["sem"] = df["sem"].fillna(0)
    return df.to_dict(orient="records")

@app.get("/api/bar")
def get_bar_data(protein: str = Query(...)):

    accession = protein.split(" (")[1][:-1]
    row = df_60[df_60["Accession"] == accession]
    if row.empty:
        return {"bars": []}
    pattern = r"Abundances \(Grouped\): (FLAT|NANO)_\d+,\s*(Wildtype|D65A)"

    matched = []
    for col in df_60.columns:
        m = re.match(pattern, col)
        if m:
            condition = m.group(1)
            group = m.group(2)
            cv_col = f"Abundances (Grouped) CV [%]: {condition}_60, {group}"
            matched.append((col, cv_col,condition, group))
    if not matched:
        return {"bars": []}
    
    bars = []
    n = 3 

    for abundance_col, cv_col, surface, group in matched:
        mean = row[abundance_col].values[0]
        cv = row[cv_col].values[0] if cv_col in row.columns else np.nan

        if pd.notna(cv) and mean and n:
            sem = (cv / 100) * (mean / np.sqrt(n))
        else:
            sem = 0

        bars.append({
            "condition": surface,
            "group": group,
            "abundance_raw": mean,
            "sem_raw": sem
        })

    ref = next((b["abundance_raw"] for b in bars if b["condition"] == "FLAT" and b["group"] == "Wildtype"), 1.0)
    if not ref or ref == 0:
        ref = 1.0


    bars_clean = []
    for b in bars:
        if not np.isfinite(b["abundance_raw"]):
            continue
        b["abundance"] = b["abundance_raw"] / ref
        b["sem"] = b["sem_raw"] / ref
        bars_clean.append(b)

    condition_comparisons = {
        "Abundance Ratio P-Value: (NANO_60, D65A) / (FLAT_60, D65A)": (["NANO", "D65A"], ["FLAT", "D65A"]),
        "Abundance Ratio P-Value: (NANO_60, Wildtype) / (FLAT_60, Wildtype)": (["NANO", "Wildtype"], ["FLAT", "Wildtype"])
    }

    genotype_comparisons = {
        "Abundance Ratio P-Value: (60, mutant) / (60, control)": (["FLAT", "D65A"], ["FLAT", "Wildtype"]),
        "Abundance Ratio P-Value: (60nano, mutant) / (60nano, control)": (["NANO", "D65A"], ["NANO", "Wildtype"])
    }

    pvals = []
    
    row = df_60[df_60["Accession"] == accession]
    for col, (g1, g2) in condition_comparisons.items():
        if col in df_60.columns:
            p = row[col].values[0]
            pvals.append({
                "group1": g1,
                "group2": g2,
                "p": float(p) if pd.notna(p) else None
            })

    row_group = df_time_var[df_time_var["Accession"] == accession]
    for col, (g1, g2) in genotype_comparisons.items():
        if not row_group.empty and col in row_group.columns:
            values = row_group[col].dropna().values
            if len(values) > 0:
                pvals.append({
                    "group1": g1,
                    "group2": g2,
                    "p": float(values[0]) if pd.notna(values[0]) else None
                })
            else:
                pvals.append({
                    "group1": g1,
                    "group2": g2,
                    "p": None
                })
        else:
            pvals.append({
                "group1": g1,
                "group2": g2,
                "p": None
            })


    return {"bars": bars_clean, "pvals": pvals}

@app.get("/api/volcano")
def get_volcano_data(time_point: str = Query(...)):
    ratio_col = f"Abundance Ratio: ({time_point}, mutant) / ({time_point}, control)"
    pval_col = f"Abundance Ratio P-Value: ({time_point}, mutant) / ({time_point}, control)"

    sub_df = df_time_var[['Gene Symbol', 'Accession', ratio_col, pval_col]].dropna().copy()
    sub_df['log2FC'] = np.log2(sub_df[ratio_col])
    sub_df['neg_log10_p'] = -np.log10(sub_df[pval_col])
    sub_df['display'] = sub_df['Gene Symbol'] + " (" + sub_df['Accession'] + ")"

    data = sub_df[['display', 'log2FC', 'neg_log10_p']].to_dict(orient="records")
    return {
        "time_point": time_point,
        "data": data
    }

@app.get("/api/multiline")
def get_multi_protein_data(proteins: list[str] = Query(...)):
    timepoints = [5, 7, 14, 30, 60]
    grouped = {}

    for protein in proteins:

        accession = protein.split(" (")[1][:-1]
        row = df_time_var[df_time_var["Accession"] == accession]
        if row.empty:
            continue

        protein_data = []

        for time in timepoints:
            ratio_col = f"Abundance Ratio: ({time}, mutant) / ({time}, control)"
            pval_col = f"Abundance Ratio P-Value: ({time}, mutant) / ({time}, control)"

            ratio = row[ratio_col].values[0] if ratio_col in row else None
            pval = row[pval_col].values[0] if pval_col in row else None

            protein_data.append({
                "time": time,
                "ratio": ratio if pd.notna(ratio) else None,
                "p_value": pval if pd.notna(pval) else None
            })

            first_valid_ratio = next((d["ratio"] for d in protein_data if d["ratio"] is not None), None)
            if first_valid_ratio and first_valid_ratio != 0:
                for d in protein_data:
                    if d["ratio"] is not None:
                        d["ratio"] = d["ratio"] / first_valid_ratio

        grouped[protein] = protein_data

    return {"data": grouped}

# frontend_path = Path(__file__).parent.parent / "frontend" / "build"
# app.mount("/", StaticFiles(directory=frontend_path, html=True), name="static")


