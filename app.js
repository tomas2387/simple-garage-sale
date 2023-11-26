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
        return <li>{detail.text}. <a href={detail.link}>More info</a></li>
    }
}

const ProductImage = ({state, imageUrl}) => {
    switch (state) {
        case "sold":
            return <img className="product-img-filter-sold" src={imageUrl} loading="lazy"/>
        case "reserved":
            return <img className="product-img-filter-reserved" src={imageUrl} loading="lazy"/>
        case "notavailable":
            return <img className="product-img-filter-notavailable" src={imageUrl} loading="lazy"/>
        case "available":
            return <img className="product-img" src={imageUrl} loading="lazy"/>
        default:
            return <img className="product-img" src={imageUrl} loading="lazy"/>
    }
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
            <ProductImage state={p.state} imageUrl={p.imageUrl} />
          </span>
      </a>
      <div className="product-details">
        <h3>{p.name}</h3>
        {discount > 0 && <span className="discount">-{discount}%</span>}
        <ul>
          {p.details.map((detail) => (
            <li>{detail}</li>
          ))}
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
