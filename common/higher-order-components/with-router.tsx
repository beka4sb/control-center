import { NavigateFunction, Params, useLocation, useNavigate, useOutletContext, useParams, useSearchParams } from 'react-router-dom';

export type WithRouterProps = {
  key: string;
  navigate: NavigateFunction;
  params: Params<string>;
  location: Location;
  context: unknown;
  searchParams: URLSearchParams;
  setSearchParams: any; // react-router-dom does not export this type for setSearchParams
};

export const withRouter = (Component: any) => {
  const Wrapper = (props: any) => {
    const params = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const outletContext = useOutletContext();

    return (
      <Component
        key={location.pathname}
        navigate={navigate}
        params={params}
        location={location}
        context={outletContext}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        {...props}
      />
    );
  };

  return Wrapper;
};
