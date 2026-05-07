export type CustomerAccessTokenCreateResponse = {
  customerAccessTokenCreate: {
    customerAccessToken: {
      accessToken: string;
      expiresAt: string;
    } | null;
    customerUserErrors: Array<{
      message: string;
    }>;
  };
};