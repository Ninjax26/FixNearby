import dotenv from 'dotenv';
dotenv.config();

const sendSMS = async ({ toPhone, message }) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromPhone = process.env.TWILIO_PHONE_NUMBER;

  const configured = accountSid && authToken && fromPhone;

  if (!configured) {
    console.log(`[SMS Mock Logging] To: ${toPhone}, Message: "${message}"`);
    return { success: true, mock: true };
  }

  try {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const authString = Buffer.from(`${accountSid}:${authToken}`).toString('base64');

    const params = new URLSearchParams();
    params.append('To', toPhone);
    params.append('From', fromPhone);
    params.append('Body', message);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `Twilio HTTP Error ${response.status}`);
    }

    console.log("Twilio SMS sent successfully, SID:", data.sid);
    return { success: true, sid: data.sid };
  } catch (error) {
    console.error("Twilio SMS Error:", error.message || error);
    throw error;
  }
};

export default sendSMS;
