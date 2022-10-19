import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const SAVE_BOOK = gql`
mutation SaveBook($title: String!, $description: String!, $bookId: ID!, $image: String!) {
  saveBook(title: $title, description: $description, bookId: $bookId, image: $image) {
    savedBooks {
      bookId
      authors
      description
      title
      image
      link
    }
  }
}
`;

export const REMOVE_BOOK = gql`
mutation RemoveBook($bookId: ID!) {
  removeBook(bookId: $bookId) {
    savedBooks {
      bookId
      authors
      description
      title
      image
      link
    }
  }
}
`;