export function getApi() {
  return fetch(
    'https://webdev-hw-api.vercel.app/api/v1/polina-rovdo/comments',
    {
      method: 'GET',
    }
  )
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else if (response.status === 500) {
        throw new Error('Сервер упал');
      } else {
        throw new Error('неизвестная ошибка');
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
export const fetchPromise = (comment) => {
  return fetch(
    'https://webdev-hw-api.vercel.app/api/v1/polina-rovdo/comments',
    {
      method: 'POST',
      body: JSON.stringify({
        text: `${comment.text.replaceAll('<', '&lt;').replaceAll('<', '&gt;')}`,
        name: comment.name.replaceAll('<', '&lt;').replaceAll('<', '&gt;'),
        forceError: true,
      }),
    }
  )
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
