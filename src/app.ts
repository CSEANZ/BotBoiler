require('dotenv').config();

import startup from './startup';
import { IBotService } from "./contract/contracts";

class App {
    run() {
        
        var appStartup = new startup();

        var botService:IBotService = appStartup.botService;
        
        botService.boot();
        
    }
}

const app = new App();
app.run();