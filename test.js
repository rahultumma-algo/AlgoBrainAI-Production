const WhatsAppToken = 'EAAhZADG5K8rIBOZCtcQuSJ32pjQO4ZAUZC3HKIoeV3w5Lxp0afkrZBGDQXRqGwGIng5XCReFndruDFF8Gd7Jgj9TrWXOyiEpSZBEfrzTrkxfg8gT9CvkgZAwoUatJJbUUq3ZCPez8ETt3c7YZBFriw8v6N4dO7aRFSeufQ01I7w4jZBaJot4Kxjbh4xX5G9WYxmwj1';
const api_version = 'v21.0';
const endpoint = `https://graph.facebook.com/${api_version}/387284451125766/messages`;
const mobileNumbers = [918128960080]; // Add more numbers as needed


const messageData = {
    messaging_product: 'whatsapp',
    to: mobileNumbers,
    type: 'template',
    template: {
        name: "web_cbt_feedback", 
        language: { code: "en" },
        components: [
          {
                type: "body",
                parameters: [
                    {
                        type: "text",
                        text: "1",
                    },
                    {
                        type: "text",
                        text: "thanks", 
                    },
                    {
                        type: "text",
                        text: "rahul", 
                    },
                    {
                        type: "text",
                        text: "rahul@gmail.com", 
                    }
                ],
            }
        ],
    },
};



fetch(endpoint, {
    method: 'POST',
    headers: {
        Authorization: `Bearer ${WhatsAppToken}`,
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(messageData),
})
    .then((response) => {
        if (response.ok) {
            console.log('Facebook API request sent successfully image');
        } else {
            return response.json().then((errorData) => {
                throw new Error(`Error sending request: ${JSON.stringify(errorData)}`);
            });        }
    })
    .catch((error) => console.error('Error fetching data:', error));

