declare module 'yuka' {
    export class Vehicle {
        update(delta: number): this;
        position: any;
        velocity: any;
    }
    export class State<T> {
        enter(entity: T): void;
        execute(entity: T): void;
        exit(entity: T): void;
    }
    export class StateMachine<T> {
        constructor(owner: T);
        update(): void;
        add(id: string, state: State<T>): void;
        changeTo(id: string): void;
    }
    export class Vector3 {
        x: number;
        y: number;
        z: number;
        constructor(x: number, y: number, z: number);
        set(x: number, y: number, z: number): this;
    }
}
