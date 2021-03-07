/*
 * @Author: conjurer
 * @Github: https://github.com/dot123
 * @Date: 2021-03-07 20:06:04
 * @LastEditors: conjurer
 * @LastEditTime: 2021-03-07 20:31:35
 * @Description:
 */
declare module "SAT" {
    export function Vector(x, y): void; //可以用 cc.V2代替
    export function Polygon(pos, points: Array<any>): void;
    export function Circle(pos, r): void;
    export function Box(pos, w, h): void;
    export function Response(): void;
    export function testCircleCircle(a, b, response): boolean;
    export function testPolygonCircle(polygon, circle, response): boolean;
    export function testCirclePolygon(circle, polygon, response): boolean;
    export function testPolygonPolygon(a, b, response): boolean;
}

declare let require: (string) => any;
