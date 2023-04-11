import slugify from '@sindresorhus/slugify';

export const REGEX = /^[a-zA-Z0-9_]{3,30}$/;

export default class Username {
  static isValid = (username: string): boolean => {
    return REGEX.test(username);
  };

  static parse = (text: string): string => {
    return slugify(text, {preserveCharacters: ['_'], separator: ''});
  };
}
