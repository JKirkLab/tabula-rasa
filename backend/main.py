from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

df = pd.read_excel("backend/data/Nano_vs_Flat_Day60.xlsx")

@app.get("/proteins")
def get_proteins():
    return df[["Accession", "Description"]].dropna().drop_duplicates().to_dict(orient="records")

@app.get("/data")
def get_data(protein: str = Query(...)):
    rows = df[df["Accession"] == protein]
    return rows.astype(str).to_dict(orient="records")

