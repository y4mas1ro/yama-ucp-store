// src/lib/merchantProducts.ts
export type MerchantProduct = {
    id: string;               // 独自ID (offerIdに相当)
    title: string;            // 商品名（20代女性向け）
    description: string;
    link: string;             // 商品ページURL
    mobileLink?: string;       // モバイル用商品ページURL (レスポンシブならlinkと同じでOK)
    imageLink: string;        // メイン画像URL
    availability: 'IN_STOCK' | 'OUT_OF_STOCK' | 'PREORDER';
    price: {
        value: string;          // "980.00" のような文字列
        currency: string;       // "JPY"
    };
    condition: 'NEW';         // テストなので固定でOK
};

export const merchantProducts: MerchantProduct[] = [
    {
        id: 'apple_01',
        title: 'ご褒美りんごジュエル',
        description: 'シャキッと甘酸っぱい、ちょっと疲れた日に自分を甘やかすご褒美りんご。',
        link: 'https://yama-ucp-store.vercel.app/products/apple_01/',
        mobileLink: 'https://yama-ucp-store.vercel.app/products/apple_01/',
        imageLink: 'https://yama-ucp-store.vercel.app/images/apple_01.jpg',
        availability: 'IN_STOCK',
        price: { value: '480.00', currency: 'JPY' },
        condition: 'NEW',
    },
    {
        id: 'orange_01',
        title: 'おうちカフェのみかんスイート',
        description: 'ビタミンたっぷりのジューシーみかん。おうちカフェ時間をちょっと華やかに。',
        link: 'https://yama-ucp-store.vercel.app/products/orange_01/',
        mobileLink: 'https://yama-ucp-store.vercel.app/products/orange_01/',
        imageLink: 'https://yama-ucp-store.vercel.app/images/orange_01.jpg',
        availability: 'IN_STOCK',
        price: { value: '380.00', currency: 'JPY' },
        condition: 'NEW',
    },
    {
        id: 'melon_01',
        title: 'ときめきメロンスパークル',
        description: '特別な日のごほうびにぴったり。とろける甘さのリッチなメロン。',
        link: 'https://yama-ucp-store.vercel.app/products/melon_01/',
        mobileLink: 'https://yama-ucp-store.vercel.app/products/melon_01/',
        imageLink: 'https://yama-ucp-store.vercel.app/images/melon_01.jpg',
        availability: 'IN_STOCK',
        price: { value: '1,980.00', currency: 'JPY' }, // カンマ抜きでもOKにするかは後で調整
        condition: 'NEW',
    },
];
