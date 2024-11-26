export const getRandomAvatar = (key: string) => {
  const prompt = key ? key : "squads-is-awesome";
  return `https://avatar.vercel.sh/${prompt}`;
};
