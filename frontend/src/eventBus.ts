import mitt from "mitt";


type Events = {
    loadBoard: void;
    moveMade: { from: string; to: string };
};

const eventBus = mitt<Events>();

export default eventBus;
