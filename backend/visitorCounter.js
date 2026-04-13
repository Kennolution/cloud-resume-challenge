import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

// Initialize the DynamoDB client. Leaving the config empty tells it to use the 
// local environment's region (us-east-1), which I set up in my SAM template.
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async () => {
    /*
     * PROD TIP: The TableName here must match exactly what I defined in my 
     * template.yaml 'Resources' section. Infrastructure as Code (IaC) 101!
     */
    const params = {
        TableName: "cloud-resume-stats", 
        Key: { id: "1" }, 
        UpdateExpression: "ADD visits :inc",
        ExpressionAttributeValues: {
            ":inc": 1
        },
        ReturnValues: "UPDATED_NEW"
    };

    try {
        // Sending the update command to DynamoDB. Using 'await' because 
        // cloud operations are asynchronous—we have to wait for the database to respond.
        const result = await docClient.send(new UpdateCommand(params));

        return {
            statusCode: 200,
            headers: {
                /* * CORS FIX: Adding these headers is crucial! 
                 * My frontend lives on a different 'origin' than this API, 
                 * so I'm telling the browser: "Hey, it's safe to let my website talk to this function."
                 */
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Methods": "GET,OPTIONS"
            },
            body: JSON.stringify({
                count: result.Attributes.visits
            })
        };

    } catch (err) {
        // Logging the error to CloudWatch so I can troubleshoot if the counter breaks again.
        console.error("CloudWatch Error Log:", err);

        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({ 
                error: "Backend issue", 
                details: err.message 
            })
        };
    }
};