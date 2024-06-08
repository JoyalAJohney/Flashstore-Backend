import { WebClient } from '@slack/web-api';
import { config } from '../common/config/config';

// Initialize the Slack client
const slackClient = new WebClient(config.slack.bot_token);

async function sendSlackNotification(channel: string, message: string) {
    try {
        await slackClient.chat.postMessage({
            channel: channel,
            text: message,
        });
        console.log('Notification sent successfully.');
    } catch (error) {
        console.error('Error sending notification:', error);
    }
}

export { sendSlackNotification };