import Toast from 'react-native-toast-message';

const AUTH_USER_TOKEN = ''; // use your own token

const fetchRequest = async (url: string, method?: string, body?: object) => {
    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            "x-auth-user": AUTH_USER_TOKEN,
        },
        method: method,
        body: JSON.stringify(body)
    });
    if(response.ok) {
        return  await response.json();
    }
    const errorMessage = `Request failed to send with error ${response.status}`;
    Toast.show({
        type: 'error',
        text1: 'Something went wrong',
        text2: errorMessage
    });
    return Promise.reject(errorMessage);
};
export { fetchRequest };