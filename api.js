const HOST_COMMENTS =
  'https://webdev-hw-api.vercel.app/api/v2/polina-rovdo/comments';
const HOST_LOGIN = 'https://webdev-hw-api.vercel.app/api/user/login';
const HOST_REGISTER = 'https://webdev-hw-api.vercel.app/api/user';

function getHeaders(token) {
  if (!token) return;
  return {
    Authorization: `Bearer ${token}`,
  };
}

export function getApi(token) {
  return fetch(HOST_COMMENTS, {
    method: 'GET',
    headers: getHeaders(token),
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else if (response.status === 500) {
        throw new Error('Ошибка при авторизации');
      } else {
        throw new Error('Нет авторизации');
      }
    })

    .then((responseData) => {
      const appComments = responseData.comments.map((comment) => {
        return {
          name: comment.author.name,
          date: new Date(comment.date).toLocaleString().slice(0, -3),
          text: comment.text,
          likes: comment.likes,
          isLiked: false,
        };
      });
      return appComments;
    })
    .catch((error) => {
      if (error.message === 'Сервер упал') {
        alert('ошибка загрузки данных');
      }
    });
}

export const postComment = (comment, token) => {
  return fetch(HOST_COMMENTS, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify({
      text: `${comment.text.replaceAll('<', '&lt;').replaceAll('<', '&gt;')}`,
      name: comment.name.replaceAll('<', '&lt;').replaceAll('<', '&gt;'),
      forceError: true,
    }),
  })
    .then((response) => {
      if (response.status === 400) {
        throw new Error('Введите более 3-х символов');
      }

      if (response.status === 500) {
        throw new Error('Сервер упал');
      } else {
        return response.json();
      }
    })

    .catch((error) => {
      if (error.message === 'Введите более 3-х символов') {
        alert(error.message);
      } else if (error.message === 'Сервер упал') {
        alert('Сервер сломался, попробуйте позже');
      } else {
        alert('Кажется, у вас сломался интернет, попробуйте позже');
      }
      throw error;
    });
};

export function loginUser({ login, password }) {
  return fetch(HOST_LOGIN, {
    method: 'POST',
    body: JSON.stringify({
      login,
      password,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error('Неверный логин или пароль');
    }
    return response.json();
  });
}

export function registerUser({ login, password, name }) {
  return fetch(HOST_REGISTER, {
    method: 'POST',
    body: JSON.stringify({
      login,
      password,
      name,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error('Такой пользователь уже существует');
    }
    return response.json();
  });
}
