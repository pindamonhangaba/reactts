import { InitialState as menuIS } from 'app/ducks/menu';
import { InitialState as henIS } from 'app/ducks/hen';

export interface RootState {
    menu: menuIS
    hen: henIS
}

