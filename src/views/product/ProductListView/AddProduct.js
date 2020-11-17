import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Select, MenuItem, InputLabel, FormControl } from '@material-ui/core';
import { proxy } from '../../../proxy';
import axios from 'axios';
import PermMediaIcon from '@material-ui/icons/PermMedia';
import { createProductApi, imageUploadApi } from '../../../api';
import ProgressBar from './ProgressBar';
import {
  Box,
  Button,
  Container,
  TextField,
  makeStyles,
  Grid
} from '@material-ui/core';
import Page from 'src/components/Page';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(1)
  },
  dragAnddropArea: {
    fontSize: '3vh',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    cursor: 'pointer'
  },
  previewImage: {
    overflowY: 'scroll',
    height: '200px'
  },
  formControl: {
    minWidth: '100%'
  }
}));

const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16
};

const thumb = {
  display: 'inline-flex',
  // borderRadius: 2,
  // border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4
  // boxSizing: 'border-box'
};

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden'
};

const img = {
  display: 'block',
  width: 'auto',
  height: '100%'
};

const AddProduct = () => {
  const classes = useStyles();

  const [sBrandName, setBrandName] = useState('');
  const [sTitle, setTitle] = useState('');
  const [sOriginalPrice, setOriginalPrice] = useState('');
  const [sDiscount, setDiscount] = useState('');
  const [sSellingPrice, setSellingPrice] = useState('');
  const [sReturnDayCount, setReturnDayCount] = useState('');
  const [sColor, setColor] = useState('');
  const [oCategory, setCategory] = useState({});
  const [sSellerBy, setSellerBy] = useState('');
  const [sImages, setImages] = useState(['']);
  const [sDetailDescription, setDetailDescription] = useState('');
  const [sQuantity, setQuantity] = useState('');
  const [sStock, setStock] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [productImages, setProductImages] = useState([]);
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: acceptedFiles => {
      setProductImages(
        acceptedFiles.map(file =>
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        )
      );
    }
  });

  // Clear all field after submit
  const handleClear = () => {
    setBrandName('');
    setTitle('');
    setOriginalPrice('');
    setDiscount('');
    setColor('');
    setSellingPrice('');
    setColor('');
    setSellerBy('');
    setDetailDescription('');
    setQuantity('');
    setCategory('');
    setStock('');
  };

  // Validation in all field
  const allFieldFilled = () => {
    if (
      sBrandName === ' ' ||
      sTitle === ' ' ||
      sOriginalPrice === ' ' ||
      sDiscount === ' ' ||
      sSellingPrice === ' ' ||
      sReturnDayCount === ' ' ||
      sColor === ' ' ||
      oCategory === ' ' ||
      sSellerBy === ' ' ||
      sDetailDescription === ' ' ||
      sQuantity === ' ' ||
      sStock === ' '
    ) {
      return false;
    } else {
      return true;
    }
  };

  const ImageUpload = async files => {
    /*** update image and getting url and
     * setphotourl
     */
    try {
      let productImages = [];
      setIsLoading(true);
      for (let i = 0; i <= files.length - 1; i++) {
        const data = new FormData();
        data.append('photo', files[i], files[i].name);
        let response = await axios.post(`${proxy}/${imageUploadApi}`, data, {
          headers: {
            accept: 'application/json',
            'Accept-Language': 'en-US,en;q=0.8',
            'Content-Type': `multipart/form-data; boundary=${data._boundary}`
          }
        });
        productImages.push(response.data.data.secure_url);
      }
      setProductImages(productImages);
      setIsLoading(false);
      
    } catch (error) {
      console.log(error);
    }
  };

  // Submit form input
  const submitProduct = () => {
    if (allFieldFilled) {
      const insertProduct = {
        brandName: sBrandName,
        title: sTitle,
        originalPrice: sOriginalPrice,
        discount: sDiscount,
        sellingPrice: sSellingPrice,
        color: sColor,
        returnDayCount: sReturnDayCount,
        category: oCategory,
        sellerBy: sSellerBy,
        images: productImages,
        detailDescription: sDetailDescription,
        quantity: sQuantity,
        stock: sStock
      };

      axios.post(`${proxy}/${createProductApi}`, insertProduct).then(res => {
        console.log(res.data);
        handleClear();
        alert('Product has been added !!');
      });
    } else {
      alert('Please all field fillup mendatory');
    }
  };

  const thumbs = productImages.map(file => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img src={file.preview} style={img} />
      </div>
    </div>
  ));

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      productImages.forEach(file => URL.revokeObjectURL(file.preview));
    },
    [productImages]
  );

  return (
    <Page className={classes.root} title="Add Product">
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Container maxWidth="md">
          <Box border={3} style={{ height: '210px' }}>
            <Grid container spacing={2}>
              <Grid
                item
                xs={12}
                md={4}
                {...getRootProps({ className: 'dropzone' })}
                className={classes.dragAnddropArea}
              >
                <Box m={5}>
                  <input
                    {...getInputProps()}
                    onChange={e => ImageUpload(e.target.files)}
                  />

                  <p>Drag 'n' drop some files here, or click to select files</p>
                  <PermMediaIcon />
                </Box>
              </Grid>
              <Grid item xs={12} md={8}>
                <Box className={classes.previewImage}>
                  <aside style={thumbsContainer}>{thumbs}</aside>
                </Box>
              </Grid>
            </Grid>
          </Box>
          <Box m={5}>{isLoading ? <ProgressBar /> : ''}</Box>

          <form onSubmit={e => e.preventDefault()}>
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Box>
                    <TextField
                      fullWidth
                      label="Brand name"
                      name="brandName"
                      onChange={e => setBrandName(e.target.value)}
                      value={sBrandName}
                    />
                    <TextField
                      fullWidth
                      label="Title"
                      name="Title"
                      onChange={e => setTitle(e.target.value)}
                      value={sTitle}
                    />
                    <TextField
                      fullWidth
                      label="Original Price"
                      type="number"
                      name="Original Price"
                      onChange={e => setOriginalPrice(e.target.value)}
                      value={sOriginalPrice}
                    />

                    <TextField
                      fullWidth
                      label="Selling Price"
                      type="number"
                      name="Selling Price"
                      onChange={e => setSellingPrice(e.target.value)}
                      value={sSellingPrice}
                    />
                    <FormControl className={classes.formControl}>
                      <InputLabel>Color</InputLabel>
                      <Select
                        label="Color"
                        labelId="color"
                        onChange={e => setColor(e.target.value)}
                        value={sColor}
                      >
                        <MenuItem value={1}>White</MenuItem>
                        <MenuItem value={1}>Black</MenuItem>
                        <MenuItem value={1}>Gray</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl className={classes.formControl}>
                      <InputLabel>Category</InputLabel>
                      <Select
                        labelId="category"
                        label="Category"
                        onChange={e => setCategory(e.target.value)}
                        value={oCategory}
                      >
                        <MenuItem value={2}>Main Category</MenuItem>
                        <MenuItem value={2}>Sub Category</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Seller By"
                    name="sellerby"
                    onChange={e => setSellerBy(e.target.value)}
                    value={sSellerBy}
                  />
                  <TextField
                    fullWidth
                    label="Discount"
                    type="number"
                    name="Discount"
                    onChange={e => setDiscount(e.target.value)}
                    value={sDiscount}
                  />
                  <TextField
                    fullWidth
                    label="Details Description"
                    multiline
                    name="description"
                    onChange={e => setDetailDescription(e.target.value)}
                    value={sDetailDescription}
                  />
                  <TextField
                    fullWidth
                    label="Quantity"
                    type="number"
                    name="quantity"
                    onChange={e => setQuantity(e.target.value)}
                    value={sQuantity}
                  />
                  <TextField
                    fullWidth
                    label="Stock"
                    type="number"
                    name="stock"
                    onChange={e => setStock(e.target.value)}
                    value={sStock}
                  />
                  <TextField
                    fullWidth
                    label="Return Day Count"
                    name="Return Day Count"
                    onChange={e => setReturnDayCount(e.target.value)}
                    value={sReturnDayCount}
                  />
                </Grid>
              </Grid>
            </Box>

            <Box my={2}>
              <Button
                color="primary"
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                onClick={() => submitProduct()}
              >
                Sign up now
              </Button>
            </Box>
          </form>
        </Container>
      </Box>
    </Page>
  );
};

export default AddProduct;
