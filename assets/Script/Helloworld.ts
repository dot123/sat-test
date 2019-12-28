/*
 * @Author: conjurer
 * @Github: https://github.com/dot123
 * @Date: 2019-07-25 10:29:34
 * @LastEditors  : conjurer
 * @LastEditTime : 2019-12-28 16:19:47
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

        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
        manager.enabledDebugDraw = true;

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
        let pos = this.node.convertToNodeSpaceAR(touchPos);
        let target = event.target;
        target.position = pos;

        pos = this.CocosPos2SATPos(pos);
        this.triangleData.pos.x = pos.x;
        this.triangleData.pos.y = pos.y;

        let response = new SAT.Response();
        let collided = SAT.testPolygonPolygon(this.triangleData, this.polygonData, response);
        if (collided) {
            this.polygonNode.color = cc.Color.RED;
            this.triangleNode.color = cc.Color.RED;

            response.overlapV.scale(0.5);
            this.triangleData.pos.sub(response.overlapV);
            this.polygonData.pos.add(response.overlapV);

            this.triangleNode.position = this.SATPos2CocosPos(this.triangleData.pos);
            this.polygonNode.position = this.SATPos2CocosPos(this.polygonData.pos);
        } else {
            this.polygonNode.color = cc.Color.WHITE;
            this.triangleNode.color = cc.Color.WHITE;
        }
        console.log(collided, response);
    }

    private CreateShape(node: cc.Node) {
        let scale = node.scale;
        let points = node.getComponent(cc.PolygonCollider).points;
        let list = [];
        for (let i = 0; i < points.length; i++) {
            let pos = points[i];
            list.push(this.V(pos.x * -1 * scale, pos.y * -1 * scale)); //x y要乘-1  逆时针
        }
        return this.P(node.position, list);
    }

    // Alias a few things in SAT.js to make the code shorter
    public V(x, y) {
        return new SAT.Vector(x, y); //向量
    }

    public P(pos, points) {
        return new SAT.Polygon(this.CocosPos2SATPos(pos), points); //多边形
    }

    public C(pos, r) {
        return new SAT.Circle(this.CocosPos2SATPos(pos), r); //圆形
    }

    public B(pos, w, h) {
        // return new SAT.Box(pos, w, h).toPolygon();
        return this.P(pos, [this.V(-w / 2, -h / 2), this.V(w / 2, -h / 2), this.V(w / 2, h / 2), this.V(-w / 2, h / 2)]); //长方形
    }

    public SATPos2CocosPos(pos) {
        return cc.v2(pos.x - 960 / 2, -pos.y + 640 / 2);
    }

    public CocosPos2SATPos(pos) {
        return this.V(pos.x + 960 / 2, -pos.y + 640 / 2);
    }
}
