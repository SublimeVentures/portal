export const partiallyApply = (Component, partialProps) => {
  return props => <Component {...partialProps} {...props} />;
};
