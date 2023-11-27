"use strict";

const sendSmsUrl = (product) => {
    return `sms://+13464978554?body=I%20am%20interested%20in%20${product.name}%20-%20${product.price}`;
}

const callUrl = (product) => {
    return `tel:+13464978554`;
}

class App extends React.PureComponent {
  render() {
    return (
      <div>
        <header>
          Tomas Garage Sale: 2LE Unit 559
        </header>
        <h3 className="subtitle">
          Cash and Zelle payment accepted. Only in The woodlands, Two Lakes Edge area.
            <br></br>
            Contact me: <a href={callUrl()}>346-497-8554</a>
          <p>
            Click the images to find more info about the product
          </p>
        </h3>

        <ProductList products={this.props.products} />
      </div>
    );
  }
}

const calculateDiscount = (price, originalPrice) => {
    return Math.round(100 - (price / originalPrice) * 100);
}

const ProductList = (props) => {
  return (
    <div className="container">
      {props.products.map((p, i) => (
        <ProductCard key={i} product={p} />
      ))}
    </div>
  );
};

const AvailableLabel = ({state}) => {
    switch (state) {
        case "sold":
            return <div className="sold">SOLD</div>
        case "reserved":
            return <div className="reserved">RESERVED</div>
        case "notavailable":
            return <div className="notavailable">NOT AVAILABLE</div>
        case "available":
            return <div className="available">AVAILABLE</div>
        default:
            return <div className="available">AVAILABLE</div>
    }
}

const ProductDetailItemList = ({detail}) => {
    if (typeof detail === "string") {
        return <li>{detail}</li>
    }

    if (typeof detail === "object") {
        return <li>{detail.text}. <a href={detail.link} target={"_blank"}>More info</a></li>
    }
}

const ProductImage = ({state, imageUrl}) => {

    let firstImage = imageUrl;
    if (Array.isArray(imageUrl)) {
        firstImage = imageUrl[0];
    }

    switch (state) {
        case "sold":
            return <img className="product-img product-img-filter-sold" src={firstImage} loading="lazy"/>
        case "reserved":
            return <img className="product-img product-img-filter-reserved" src={firstImage} loading="lazy"/>
        case "notavailable":
            return <img className="product-img product-img-filter-notavailable" src={firstImage} loading="lazy"/>
        case "available":
        default:
            if (Array.isArray(imageUrl)) {
                return <div className={"slides-container"}>
                    <div className={"slides"}>
                        {imageUrl.map((image, index, array) => <><span
                            className={"slides-number"}>{index + 1} / {array.length}</span>
                            <img className="product-img" src={image} loading="lazy"/></>)}
                    </div>
                    <a className="prev" onclick="plusSlides(-1)">&#10094;</a>
                    <a className="next" onclick="plusSlides(1)">&#10095;</a>
                </div>
            }

            return <img className="product-img" src={firstImage} loading="lazy"/>
    }
}

const MoreInfoItemList = ({url}) => {
    if (!url) {
        return null;
    }
    const extension = url.split('.').pop();
    const isImage = ["jpg", "jpeg", "png", "gif"].includes(extension);
    const isAmazonLink = /amazon/.test(url);

    if (isImage) {
        return <li><a href={url} target={"_blank"}>See the big picture here</a></li>;
    }

    if (isAmazonLink) {
        return <li><a href={url} target={"_blank"}>Amazon Link</a></li>;
    }

    return <li><a href={url} target={"_blank"}>Product info here</a></li>;
}

const ProductCard = (props) => {
  const p = props.product;
  const formatPrice = (p) =>
    p.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
    const discount = calculateDiscount(p.price, p.originalPrice)

  return (
    <div className="product">
        <a href={p.url} target="_blank">
          <span className="product-span">
            <AvailableLabel state={p.state}/>
            <ProductImage state={p.state} imageUrl={p.imageUrl}/>
          </span>
        </a>
        <div className="product-details">
            <h3>{p.name}</h3>
            {discount > 0 && <span className="discount">-{discount}%</span>}
            <ul>
                {p.details.map((detail) => <ProductDetailItemList detail={detail}/>)}
                {p.buyer && p.state === "sold" && <li className={"sold-item-list-buyer-name"}>Buyer: {p.buyer}</li>}
                {p.buyer && p.state === "reserved" && <li className={"reserved-item-list-reserve-name"}>Reserved for: {p.buyer}</li>}
                <MoreInfoItemList url={p.url} />
            </ul>
        </div>
        <a href={sendSmsUrl(p)} className="box-price">
            <span className="price">
                <span className="old-price">{formatPrice(p.originalPrice)}</span>
                <span className={"new-price"}>{formatPrice(p.price)}</span>
            </span>
            <div className="box">
                <span>📞</span>
                <button className="payment">&nbsp;Contact</button>
            </div>
        </a>
    </div>
  );
};

// Load the data.json file and parse it
fetch("./data.json")
  .then((response) => response.json())
    .then((productsData) =>
        productsData
            .sort((a, b) =>
                calculateDiscount(a.price, a.originalPrice) - calculateDiscount(b.price, b.originalPrice))
            .reverse()
    )

    .then((productsData) => {
      ReactDOM.render(
      <App products={productsData} />,
      document.getElementById("root")
    );
  });
