export default function Sleep(
  time: number,
  cancelToken?: AbortSignal,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(resolve, time);
    if (cancelToken) {
      cancelToken.addEventListener('abort', () => {
        clearTimeout(timeout);
        reject(new Error('Sleep was aborted'));
      });
    }
  });
}
