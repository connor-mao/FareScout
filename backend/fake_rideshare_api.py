from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app)

# Load CSV data once
df = pd.read_csv("rideshare_data.csv")

@app.route("/api/ride/estimate", methods=["GET"])
def estimate_ride():
    start = request.args.get("start")
    end = request.args.get("end")
    time = request.args.get("time")  # optional but useful

    if not start or not end:
        return jsonify({
            "error": "Missing 'start' and 'end' parameters"
        }), 400

    # Filter rows matching query
    results = df[
        (df["start_location"] == start) &
        (df["end_location"] == end) &
        ((df["time_of_day"] == time) if time else True)
    ]

    if results.empty:
        return jsonify({"error": "No data found"}), 404

    # Convert rows to list of JSON objects
    response = results.to_dict(orient="records")

    return jsonify({
        "query": {
            "start": start,
            "end": end,
            "time": time
        },
        "results": response
    })

if __name__ == "__main__":
    app.run(debug=True)
