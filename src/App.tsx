import { IonApp, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

/* Global styles */
import './index.css';
import './App.css';

/* Pages */
import Admin from './pages/Admin';
import Employee from './pages/Employee';
import StartingPage from './pages/Landingpage/StartingPage';
import UserRole from './pages/Landingpage/User_Role';

setupIonicReact();

const App: React.FC = () => {
  return (
    <AuthProvider>
      <IonApp>
        <IonReactRouter>
          {/* Landing / role selection */}
          <Route exact path="/" component={StartingPage} />
          <Route exact path="/menu-admin" component={UserRole} />

          {/* Main apps by role */}
          <Route path="/admin" component={Admin} />
          <Route path="/employee" component={Employee} />

          {/* Fallback */}
          <Redirect exact from="/home" to="/" />
        </IonReactRouter>
      </IonApp>
    </AuthProvider>
  );
};

export default App;
