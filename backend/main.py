from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import re
import numpy as np

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

df_60 = pd.read_excel("backend/data/Nano_vs_Flat_Day60.xlsx")
df_time_var = pd.read_excel("backend/data/regnier_all_combined_wpval.xlsx")


def get_surface(tag):
    return "nano" if "nano" in tag.lower() else "flat"

def normalize_surface(s):
    return s.upper()  

def normalize_group(g):
    return "D65A" if g == "mutant" else "Wildtype"

@app.get("/proteins")
def get_proteins():
    return df_60[["Accession", "Description"]].dropna().drop_duplicates().to_dict(orient="records")

@app.get("/data")
def get_data(protein: str = Query(...)):
    row = df_time_var[df_time_var["Accession"] == protein]

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

    return df.to_dict(orient="records")

@app.get("/bar")
def get_bar_data(protein: str = Query(...)):
    row = df_60[df_60["Accession"] == protein]
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

    for b in bars:
        b["abundance"] = b["abundance_raw"] / ref
        b["sem"] = b["sem_raw"] / ref
        del b["abundance_raw"]
        del b["sem_raw"]

    condition_comparisons = {
        "Abundance Ratio P-Value: (NANO_60, D65A) / (FLAT_60, D65A)": (["NANO", "D65A"], ["FLAT", "D65A"]),
        "Abundance Ratio P-Value: (NANO_60, Wildtype) / (FLAT_60, Wildtype)": (["NANO", "Wildtype"], ["FLAT", "Wildtype"])
    }

    genotype_comparisons = {
        "Abundance Ratio P-Value: (60, mutant) / (60, control)": (["FLAT", "D65A"], ["FLAT", "Wildtype"]),
        "Abundance Ratio P-Value: (60nano, mutant) / (60nano, control)": (["NANO", "D65A"], ["NANO", "Wildtype"])
    }

    pvals = []

    row = df_60[df_60["Accession"] == protein]
    for col, (g1, g2) in condition_comparisons.items():
        if col in df_60.columns:
            p = row[col].values[0]
            pvals.append({
                "group1": g1,
                "group2": g2,
                "p": float(p) if pd.notna(p) else None
            })

    row_group = df_time_var[df_time_var["Accession"] == protein]
    for col, (g1, g2) in genotype_comparisons.items():
        if col in df_time_var.columns:
            p = row_group[col].values[0]
            pvals.append({
                "group1": g1,
                "group2": g2,
                "p": float(p) if pd.notna(p) else None
            })

    print(bars)
    return {"bars": bars, "pvals": pvals}
