import { InitialState as menuIS } from 'app/ducks/menu';
import { InitialState as henIS } from 'app/ducks/hen';
import { InitialState as editorIS } from 'app/ducks/editor';

export interface RootState {
    menu: menuIS
    hen: henIS
    editor: editorIS
}

