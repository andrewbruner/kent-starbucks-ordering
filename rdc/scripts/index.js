import model from "./model.js";
import view from "./view.js";

model.getRemoteDatabase();
model.updateRemoteDatabase();
view.updateView(model.database);
