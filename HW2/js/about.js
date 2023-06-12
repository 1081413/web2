function Cart() {
    // localStorage key
    this.key = 'example-cart';
    // 購物車的資料
    this.data = [];
    // 初始化購物車
    this.initCart = function () {
        // 取得user在localStorage裡的資訊
        const storageData = localStorage.getItem(this.key);
        // 如果有資料將資料轉回物件，如果無資料預設空陣列
        this.data = storageData ? JSON.parse(storageData) : [];
        // 顯示資料
        this.render();
    }
    // 傳入商品id與數量並新增商品至購物車
    this.addItem = function (pid, amount) {
        // 透過pid尋回product的資料
        const product = products.find(function (p) {
            // 回傳一個檢索的邏輯
            // 如果產品的id等於是使用者送出表單的pid
            return p.id === pid
        });
        // 產生購物車的新項目
        const newItem = {
            pid: product.id,
            title: product.title,
            price: product.price,
            amount: amount,
            // 取得現在的時間戳記
            createdAt: new Date().getTime()
        };
        // 把新項目加到購物車的資料內
        this.data.push(newItem);
        // 更新storage資料
        this.updateDataToStorage();
        // 渲染畫面
        this.render();
        // 把成功訊息顯示
        Swal.fire({
            title: '已加入購物車',
            text: `${newItem.title}已加入${newItem.amount}項至購物車`,
            type: 'success'
        });
    }
    // 至購物車刪除於購物車內指定索引商品
    this.deleteItem = function (i) {
        // 在this.data裡從索引i刪除1筆資料
        this.data.splice(i, 1);
        this.updateDataToStorage();
        this.render();
    }
    // 清空購物車
    this.emptyCart = function () {
        this.data = [];
        this.updateDataToStorage();
        this.render();
    }
    // 更新資料到localStorage
    this.updateDataToStorage = function () {
        // 把目前的資料轉成字串
        const storageData = JSON.stringify(this.data);
        // 更新到localStorage
        localStorage.setItem(this.key, storageData);
    }
    // 渲染購物車
    this.render = function () {
        const tbody = '#cartTableBody',
            tfoot = '#cartTableFoot',
            cartNavLink = '#cartNavLink',
            cartLength = this.data.length;
        const navLinkHTML = cartLength > 0 ? `
            購物車 <span class="badge badge-primary">${cartLength}</span>
        ` : '購物車';
        // document.getElementById('cartNavLink').innerHTML = navLinkHTML;
        $(cartNavLink).html(navLinkHTML);
        // 把舊資料清空
        $(tbody).empty();
        $(tfoot).empty();
        // 預設總金額是0
        let summation = 0;
        // 再把資料取出顯示到畫面上
        this.data.forEach(function (item, i) {
            $(tbody).append(`<tr>
                <td>
                    <button data-index="${i}" class="btn btn-danger btn-sm delete-btn">&times;</button>
                    ${item.title}
                </td>
                <td class="text-right">$ ${item.price}</td>
                <td class="text-right">${item.amount}</td>
                <td class="text-right">$ ${item.price * item.amount}</td>
            </tr>`);
            // 把數量與單價相乘並加總至總數
            summation += item.price * item.amount;
        });
        // 把總金額顯示
        $(tfoot).append(`<tr>
            <th>合計</th>
            <td class="text-right" colspan="3">$ ${summation}</td>
        </tr>`);
    }
}

// 產生一個購物車的實例
const cart = new Cart();
// 初始化購物車
cart.initCart();

// 為每個在#productRow裡的.product-form註冊表單事件
$('#productRow').delegate('.product-form', 'submit', function (event) {
    event.preventDefault();
    // 產品的id
    const pid = $(this).attr('data-id');
    // user填寫的數量
    const amount = parseInt($(`#productAmount${pid}`).val());
    // 把產品加到購物車
    cart.addItem(pid, amount);
});

$('#emptyCartBtn').click(function () {
    // 把購物車資料清空
    cart.emptyCart();
});

// $('.delete-btn').click(function () {
//     console.log(this);
// });
$('#cartTableBody').delegate('.delete-btn', 'click', function () {
    console.log(this);
    const itemIndex = parseInt($(this).attr('data-index'));
    console.log(itemIndex);
    // 移除指定的資料
    cart.deleteItem(itemIndex);
})


const products = [
    {
        id: '1',
        title: '條紋襯衫',
        price: 100,
        category: {
            style1: 'M',
        },
        img: 'images/襯衫.JPG',
        isAvailable: true
    },
    {
        id: '2',
        title: 'PUMA外套',
        price: 150,
        category: {
            style1: 'S',
           
        },
        img: 'images/外套.JPG',
        isAvailable: true
    },
    {
        id: '3',
        title: 'T-shirt',
        price: 50,
        category: {
            style1: 'M',
            
        },
        img: 'images/白踢.JPG',
        isAvailable: true
    },
    {
        id: '4',
        title: '帽T',
        price: 250,
        category: {
            style1: '黑色L',
           
        },
        img: 'images/帽踢.JPG',
        isAvailable: true
    },
    {
        id: '5',
        title: '黑T',
        price: 50,
        category: {
            style1: 'M',
           
        },
        img: 'images/黑踢.JPG',
        isAvailable: true
    },
    {
        id: '6',
        title: '黃T',
        price: 200,
        category: {
            style1: 'M',
           
        },
        img: 'images/黃踢.JPG',
        isAvailable: true
    },
    
];

// 渲染商品
function renderProducts() {
    // 把products的資料取出
    products.forEach(function (product) {
        // 選到id叫做productRow的元素，並在其內部放入...
        // document.getElementById('productRow').innerHTML += `<div>...</div>`
        $('#productRow').append(`<div class="cards col-md-4">
            <div class="card">
                <img class="card-img" src="${product.img}" class="card-img-top">
                <form data-id="${product.id}" class="card-body product-form">
                    <h5 class="card-title">${product.title}</h5>
                    <p class="card-text">NT$ ${product.price} </p>
                    <select id="productCategory${product.id}" class="form-control productCategory" placeholder="-- Category --" required>
                        <option value=''>請選擇尺寸</option>
                        <option value='${product.category.style1}'>${product.category.style1}</option>
                        <option value='${product.category.style2}'>${product.category.style2}</option>
                        <option value='${product.category.style3}'>${product.category.style3}</option>
                    </select>
                    <br>
                    <input id="productAmount${product.id}" min="1" max="1" class="form-control productNumber" type="number" placeholder="請輸入數量" required>
                    <button type="submit" class="btn submit-btn btn-primary btn-block mt-2">新增至購物車</button>
                </form>
            </div>
        </div>`);
    });
}

renderProducts();
// products.title;