declare module "LanguageData" {
    export function init(language: string): void;

    export function t(key: string, opt: Object = null): string;

    export function updateSceneRenderers(): void;
}

declare module "HootMgr" {
    export function GetModel(): any;
}

declare module "FileSaver" {
    export function saveAs(file: File);
}

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

declare namespace TalkingData {
    class TDCCAccount {
        public static setAccount(accountId: string): TDCCAccount;

        setAccountName(accountName: string): void;

        setAccountType(accountType: any): void;

        setLevel(level: number): void;

        setGender(gender: any): void;

        setAge(age: number): void;

        setGameServer(gameServer: string): void;
    }

    class TDCCMission {
        public static onBegin(missionId: string): TDCCAccount;
        public static onCompleted(missionId: string): void;
        public static onFailed(missionId: string, failedCause: string): void;
    }
    class TDCCVirtualCurrency {
        public static onChargeRequest(orderId: string, iapId: string, currencyAmount: number, currencyType: string, virtualCurrencyAmount: number, paymentType: string): void;
        public static onChargeSuccess(orderId: string): void;
        public static onReward(currencyAmount: number, reason: string): void;
    }

    class TDCCItem {
        public static onPurchase(item: string, number: number, price: number): void;
        public static onUse(item: string, number: number): void;
    }
}
