import { RouterProvider } from 'react-router-dom';
import { router } from './app/router';
import { AuthInitializer } from './features/auth/components/auth-initializer';

export function App() {
  return (
    <AuthInitializer>
      <RouterProvider router={router} />
    </AuthInitializer>
  );
}

export default App;
