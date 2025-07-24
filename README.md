# tabula-rasa
A webtool designed to help explore the iPSC Kirk Lab Project for the paper titled:

**Calcium-Activated Sarcomere Contractility Drives Cardiomyocyte Maturation and the Response to External Mechanical Cues but is Dispensable for Sarcomere Formation.**

You can visit the webtool here: https://jkirklab.github.io/tabula-rasa/

The backend is hosted on the render free tier, which spins down instances based on usage. Please wait a few minutes for the instance to spin up if the webtool has not been used in a while. 

# Specifications
- There are two separate excel spreadsheets that the data is pulled from. These are present in `/backend/data`:
    - `Nano_vs_Flat_Day_60.xlsx`
    - `regnier_all_combined_wpval.xlsx`
- Each individual mass spec run contained in these two excel sheets contains a unique set of proteins, many of which overlap. However some proteins may be detected in only some of the runs, and therefore will appear only in certain dropdown menus. 
- The webtool will display all the data that is present in the spreadsheet. If there is no data available for the selected protein, no plot will be drawn.
- Additionally, if there is partial data (especially for the mass spec runs across the 60 days) for a specific protein, the webtool will display the partial points. However no normalization will be applied in the single protein expression line plot.
- The multiline plot will accept a maximum of 5 protein selections.
- If a protein exists in the dropdown but does not display any data, the protein likely was detected but no quantification occured. 
- The free tier has relatively weak compute. It is unlikely, but the service may go down if too many users connect simultaneously.


# Testing
To run this app locally, open two terminals and run the following commands. 

```bash
cd frontend
#optionally npm install (if first time setup)
npm start
```

To setup the virtual environment

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

```bash
source .venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
