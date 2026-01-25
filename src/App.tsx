import { Registration } from "./pages/Resistration/Registration";
import { Settings } from "./pages/Settings/Settings";
import { Home } from "./pages/Home/Home";
import { Navigate, Route, Routes } from "react-router";
import { useCheckRegistration } from "./hooks/useCheckRegistration";
import { PrivateRoute } from "./routers/PrivateRoute";

export const App: React.FC = () => {
  const {
    isRegistered,
    isLoading,
    isError,
    refetch,
    userObj,
    userData,
    hasClickedToday,
    timer,
  } = useCheckRegistration();
  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (isError) {
    return <div>Ошибка...</div>;
  }

  return (
    <Routes>
      {/* Public route: страница регистрации.
            Если пользователь уже зарегистрирован — редиректим его на "/" (или на /questions) */}
      <Route
        path='/registration'
        element={
          isRegistered ? (
            <Navigate to='/' replace />
          ) : (
            <Registration userObj={userObj} onSuccess={refetch} />
          )
        }
      />

      {/* Private routes: все вложенные маршруты будут доступны только если PrivateRoute разрешит */}
      <Route element={<PrivateRoute isRegistered={isRegistered} />}>
        <Route
          path='/'
          element={
            <Home
              userObj={userObj}
              userData={userData}
              hasClickedToday={hasClickedToday}
              timer={timer}
            />
          }
        />
        <Route path='/settings' element={<Settings />} />
      </Route>

      {/* Fallback: на любой неизвестный путь — отправляем в зависимости от статуса */}
      <Route
        path='*'
        element={<Navigate to={isRegistered ? "/" : "/registration"} replace />}
      />
    </Routes>
  );
};
