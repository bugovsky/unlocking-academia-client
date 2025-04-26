import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, type createRouter } from "@tanstack/react-router";
import type { FunctionComponent } from "./common/types";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const queryClient = new QueryClient();

type AppProps = { router: ReturnType<typeof createRouter> };

const App = ({ router }: AppProps): FunctionComponent => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </QueryClientProvider>
  );
};

export default App;