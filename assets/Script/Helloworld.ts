/*
 * @Author: conjurer
 * @Github: https://github.com/dot123
 * @Date: 2019-07-25 10:29:34
 * @LastEditors: conjurer
 * @LastEditTime: 2021-03-07 20:36:26
 * @Description:
 */
import SAT = require("SAT");

const { ccclass, property } = cc._decorator;

@ccclass
export default class Helloworld extends cc.Component {
    @property(cc.Node)
    private polygonNode: cc.Node = null;

    @property(cc.Node)
    private triangleNode: cc.Node = null;

    private triangleData = null;

    private polygonData = null;

    public onLoad() {
        this.RegTouchEvent(this.triangleNode);

        this.triangleData = this.CreateShape(this.triangleNode);
        this.polygonData = this.CreateShape(this.polygonNode);
    }

    private RegTouchEvent(touchNode: cc.Node) {
        touchNode.on("touchstart", this.OnTouchStart.bind(this));
        touchNode.on("touchmove", this.OnTouchMove.bind(this));
        touchNode.on("touchend", this.OnTouchEnd.bind(this));
        touchNode.on("touchcancel", this.OnTouchCancel.bind(this));
    }

    //-------------点击事件--------------
    private OnTouchStart(event) {
        this.CheckContact(event);
    }

    private OnTouchMove(event) {
        this.CheckContact(event);
    }

    private OnTouchEnd(event) {
        this.CheckContact(event);
    }

    private OnTouchCancel(event) {
        this.OnTouchEnd(event);
    }

    private CheckContact(event) {
        let touchPos = event.getLocation();
        let target = event.target;
        target.position = touchPos;

        this.triangleData.pos.x = touchPos.x;
        this.triangleData.pos.y = touchPos.y;

        let response = new SAT.Response();
        let collided = SAT.testPolygonPolygon(this.triangleData, this.polygonData, response);
        if (collided) {
            this.polygonNode.color = cc.Color.RED;
            this.triangleNode.color = cc.Color.RED;

            response.overlapV.scale(0.5);
            this.triangleData.pos.sub(response.overlapV);
            this.polygonData.pos.add(response.overlapV);

            this.triangleNode.x = this.triangleData.pos.x;
            this.triangleNode.y = this.triangleData.pos.y;
            this.polygonNode.x = this.polygonData.pos.x;
            this.polygonNode.y = this.polygonData.pos.y;
        } else {
            this.polygonNode.color = cc.Color.WHITE;
            this.triangleNode.color = cc.Color.WHITE;
        }
        console.log(collided, response);
    }

    private CreateShape(node: cc.Node) {
        let scale = node.scale;
        //顶点数组
        let points = node.getComponent(cc.PolygonCollider).points;
        let list = [];
        for (let i = 0; i < points.length; i++) {
            let pos = points[i];
            list.push(this.V(pos.x * scale, pos.y * scale));
        }
        return this.P(node.position, list);
    }

    // Alias a few things in SAT.js to make the code shorter
    public V(x, y) {
        //向量
        return new SAT.Vector(x, y);
    }

    //多边形
    public P(pos, points) {
        return new SAT.Polygon(pos, points);
    }

    //圆形
    public C(pos, r) {
        return new SAT.Circle(pos, r);
    }

    //矩形
    public B(pos, w, h) {
        // return new SAT.Box(pos, w, h).toPolygon();
        return this.P(pos, [this.V(-w / 2, -h / 2), this.V(w / 2, -h / 2), this.V(w / 2, h / 2), this.V(-w / 2, h / 2)]);
    }
}
