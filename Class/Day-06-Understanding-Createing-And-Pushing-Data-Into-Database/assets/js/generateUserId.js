const generateUserID = () => {
  return crypto.randomUUID();
};

export default generateUserID;