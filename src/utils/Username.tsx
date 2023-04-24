import slugify from '@sindresorhus/slugify';

export const REGEX = /^[a-zA-Z0-9_]{3,30}$/;

export default class username {
  static isValid = (text: string): boolean => {
    return REGEX.test(text);
  };

  static parse = (text: string): string => {
    return slugify(text, {preserveCharacters: ['_'], separator: ''});
  };
}
