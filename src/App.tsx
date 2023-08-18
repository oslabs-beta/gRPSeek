import './styles.css';
export const App = () => {
  return (
    <div>
      <h1>React TypeScript Webpack Starter Template</h1>
      <p>{process.env.NODE_ENV}</p>
      <p>{process.env.name}</p>
    </div>
  );
};
