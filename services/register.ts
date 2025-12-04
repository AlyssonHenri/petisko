import axios from 'axios';
import { RootUser, UserRegister } from '@/interfaces/user';
import { API_BASE_URL } from '@/constants/ApiConfig';


export default async function registerUser(user: UserRegister): Promise<{ success: boolean; data: RootUser | any }> {
  try {

    const formData = new FormData();
    (Object.keys(user) as Array<keyof UserRegister>).forEach(key => {
      if (key === 'img') {
        const uri = user[key];
        if (uri) {
          const name = uri.split('/').pop();
          const type = `image/${name?.split('.').pop()}`;
          formData.append(key, { uri, name, type } as any);
        }
      } else {
        formData.append(key, user[key] as string);
      }
    });

    const response = await axios.post(`${API_BASE_URL}/auth/users/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, data: error.response.data };
  }
}