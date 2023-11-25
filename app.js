"use strict";

const tel = "tel:+1-346-497-8554";
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
            Contact me: <a href={tel}>346-497-8554</a>
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
        {p.state == "sold" ? (
          <span className="product-span">
            <div className="sold">SOLD</div>
            <img
              className="product-img-filter-sold"
              src={p.imageUrl}
              loading="lazy"
            />
          </span>
        ) : (
          ""
        )}
        {p.state == "reserved" ? (
          <span className="product-span">
            <div className="reserved">RESERVED</div>
            <img
              className="product-img-filter-reserved"
              src={p.imageUrl}
              loading="lazy"
            />
          </span>
        ) : (
          ""
        )}
        {p.state == "notavailable" ? (
          <span className="product-span">
            <div className="notavailable">NOT AVAILABLE</div>
            <img
              className="product-img-filter-notavailable"
              src={p.imageUrl}
              loading="lazy"
            />
          </span>
        ) : (
          ""
        )}
        {p.state == "available" ? (
          <span className="product-span">
            <div className="available">AVAILABLE</div>
            <img className="product-img" src={p.imageUrl} loading="lazy" />
          </span>
        ) : (
          ""
        )}
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
      <a href={tel} className="box-price">
        <span className="price">{formatPrice(p.price)}</span>
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
