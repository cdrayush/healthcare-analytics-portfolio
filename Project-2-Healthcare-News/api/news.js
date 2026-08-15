export default async function handler(req, res) {
    try {
        const query =
            req.query.q ||
            "healthcare OR health OR medical OR hospital OR pharma OR medtech";

        const params = new URLSearchParams({
            q: query,
            language: "en",
            sortBy: "publishedAt",
            pageSize: "100"
        });

        const response = await fetch(
            `https://newsapi.org/v2/everything?${params.toString()}`,
            {
                headers: {
                    "X-Api-Key": process.env.API_KEY
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                error: data.message || "NewsAPI request failed"
            });
        }

        return res.status(200).json(data);

    } catch (error) {
        return res.status(500).json({
            error: "Server error",
            message: error.message
        });
    }
}