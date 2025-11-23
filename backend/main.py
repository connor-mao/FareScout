from fastapi import FastAPI
import pandas as pd
app = FastAPI()
df = pd.read_csv("rides.csv")

@app.get("/")
def home():
    return {"message": "backend running"}
#a python dictionary

@app.get("/compare")
def compare(start_location: str, end_location: str, time_of_day: str):
    filtered = df[
        (df["start_location"] == start_location) & 
        (df["end_location"] == end_location) &
        (df["time_of_day"] == time_of_day)
    ]

    if filtered.empty:
        return {"error": "no data found for this route at specified time"}
    
    result = {}
    for service in filtered["service"].unique():
        service_data = filtered[filtered["service"] == service]
        result[service] = {
            "price": round(service_data["price"].mean(), 2),
            "distance_miles": round(service_data["distance_miles"].mean(), 2),
            "estimated_duration_min": round(service_data["estimated_duration_min"].mean(), 2)
        }
    
    return {
        "start_location": start_location,
        "end_location": end_location,
        "time_of_day": time_of_day,
        "services": result
    }