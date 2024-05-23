import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const s3 = new S3Client({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_REGION,
  });

  const league = req.query.league;
  const date = new Date();
  const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`; // Get today's date

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `matches/${formattedDate}.json` 
  };

  try {
    const command = new GetObjectCommand(params);
    const response = await s3.send(command);
    const bodyString = await streamToString(response.Body);

    const allProps = JSON.parse(bodyString);
    const leagueProps = allProps.filter(prop => prop.league === league); 
    res.status(200).json(leagueProps); 
  } catch (err) {
    console.error("Error fetching or filtering props:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Helper function to convert ReadableStream to string (same as before)
async function streamToString(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  });
}
