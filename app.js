"use strict";

const tel = "tel:+1-346-497-8554";
class App extends React.PureComponent {
  render() {


    //const sortedProducts = this.props.products.sort((a, b) => a.price - b.price)

    return (
      <div>
        <header>
          Garage Sale: 2LE Unit 559
        </header>
        <h3 className="subtitle">
          Zelle payment accepted. Only in The woodlands, Two Lakes Edge area.
          <p>
            If you click over the images you can find more info about the product
          </p>
        </h3>
        <ProductList products={this.props.products} />
      </div>
    );
  }
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
  const discount = Math.round(100 - (p.price / p.originalPrice) * 100);

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
      <div onClick={goWhatsapp} className="box-price">
        <span className="price">{formatPrice(p.price)}</span>
        <div className="box">
          <img className="icon" src="./whatsapp-icon.png" />
          <a href={tel} className="payment">&nbsp;Contact</a>
        </div>
      </div>
    </div>
  );
};

// Load the data.json file and parse it
fetch("./data.json")
  .then((response) => response.json())
  .then((productsData) => {
    // Assuming the JSON contains an array of products
    const products = productsData;
    ReactDOM.render(
      <App products={products} />,
      document.getElementById("root")
    );
  });
