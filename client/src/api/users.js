const BASE_URL = 'http://localhost:3201/api/user';

export async function register(user) {
    const response = await fetch(BASE_URL + '/register', {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const obj = await response.json();
    if (obj.success) {
        return {data: obj.data, Token: obj.token};
    }
    throw new Error(obj.message);
}

export async function login(email, password){
    const response = await fetch(BASE_URL + '/login', {
        method: 'POST',
        body: JSON.stringify({email, password}),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const obj = await response.json();
    if (obj.success) {
        return {data: obj.data, Token: obj.token};
    }
    throw new Error(obj.message);
}

