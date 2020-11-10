import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import MenuItem from '@material-ui/core/MenuItem';
import { proxy } from '../../../proxy';
import axios from 'axios';
import PermMediaIcon from '@material-ui/icons/PermMedia';

import {
  Box,
  Button,
  Checkbox,
  Container,
  FormHelperText,
  Link,
  TextField,
  Typography,
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
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    cursor: "pointer"
  },
  previewImage: {
    overflowY: "scroll", 
    height: "200px",
    
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
  padding: 4,
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
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: acceptedFiles => {
      setFiles(
        acceptedFiles.map(file =>
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        )
      );
    }
  });

  const uploadFiles = async() =>{
    // console.log(files)
    let images = [];
    for(let i = 0; i< files.length - 1; i++){
      try {
        let uploadData = new FormData()
        uploadData.append("photo", files[i], files[i].name);
        // axios.defaults.headers.common['Authorization'] = localStorage.getItem('Token');
        axios.post(`${proxy}/api/v1/product/imageUpload`, uploadData).then(res => {
         console.log(res);
         images.push(res.data.secure_url)
        })
      } catch (error) {
        console.log(error)
      }
     
    }
  }


  const thumbs = files.map(file => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img src={file.preview} style={img} />
      </div>
    </div>
  ));

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach(file => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  const colors = [
    {
      value: 'white',
      label: 'White'
    },
    {
      value: 'black',
      label: 'Black'
    },
    {
      value: 'pink',
      label: 'Pink'
    }
  ];

  return (
    <Page className={classes.root} title="Add Product">
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Container maxWidth="md">
        <Button onClick={() => uploadFiles()}>
                    Add Image
                  </Button>
          <Box border={3} style={{ height: '210px' }}>
          
            <Grid container spacing={2}>
              <Grid item xs={12} md={4} {...getRootProps({ className: 'dropzone' })} className={classes.dragAnddropArea}>
                <Box  m={5}  >
                  <input {...getInputProps()} />

                  <p>Drag 'n' drop some files here, or click to select files</p>
                  <PermMediaIcon />

                  
                </Box>
              </Grid>
              <Grid item xs={12} md={8} >
                <Box className={classes.previewImage}>
                <aside style={thumbsContainer}>{thumbs}</aside>
                </Box>
               
              </Grid>
            </Grid>
          </Box>

          <Formik
            initialValues={{
              brandName: '',
              title: '',
              originalPrice: '',
              discount: '',
              color: '',
              retrunDayCount: '',

              category: '',
              sellerBy: '',
              detailDescription: '',
              stock: '',
              quantity: '',
              policy: false
            }}
            validationSchema={Yup.object().shape({
              brandName: Yup.string()
                .max(255)
                .required('Brand name is required'),
              title: Yup.string()
                .max(255)
                .required('Title is required'),
              originalPrice: Yup.number()
                .integer()
                .required('Original price is required'),

              discount: Yup.number()
                .integer()
                .required('Discount is required'),
              Color: Yup.string()
                .max(255)
                .required('Color is required'),
              retrunDayCount: Yup.number()
                .integer()
                .required('Return day is required'),

              category: Yup.string()
                .max(255)
                .required('Category is required'),
              sellerBy: Yup.string()
                .max(255)
                .required('Seller by is required'),

              detailDescription: Yup.string()
                .max(255)
                .required('Details description is required'),
              stock: Yup.number()
                .integer()
                .required('Stock is required'),
              quantity: Yup.number()
                .integer()
                .required('Quantity is required'),
              policy: Yup.boolean().oneOf([true], 'This field must be checked')
            })}
            onSubmit={value => {
              console.log('hitt', value);
              axios
                .post(`${proxy}/api/v1/product/createProduct`, value)
                .then(res => {
                  console.log(res);
                  alert('Product has been added !!');
                  navigate('/app/dashboard', { replace: true });
                });
            }}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              // isSubmitting,
              touched,
              values
            }) => (
              <form onSubmit={handleSubmit}>
                <Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Box>
                        <TextField
                          error={Boolean(touched.brandName && errors.brandName)}
                          fullWidth
                          helperText={touched.brandName && errors.brandName}
                          label="Brand name"
                          margin="normal"
                          name="brandName"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.brandName}
                        />
                      </Box>
                      <Box>
                        <TextField
                          error={Boolean(
                            touched.originalPrice && errors.originalPrice
                          )}
                          fullWidth
                          helperText={
                            touched.originalPrice && errors.originalPrice
                          }
                          label="Original Price"
                          margin="normal"
                          name="originalPrice"
                          type="number"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.originalPrice}
                        />
                      </Box>
                      <Box>
                        <TextField
                          error={Boolean(touched.color && errors.color)}
                          fullWidth
                          helperText={touched.color && errors.color}
                          select
                          label="Color"
                          margin="normal"
                          name="color"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.color}
                        >
                          {colors.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Box>

                      <Box>
                        <TextField
                          error={Boolean(touched.sellerBy && errors.sellerBy)}
                          fullWidth
                          helperText={touched.sellerBy && errors.sellerBy}
                          label="Seller By"
                          margin="normal"
                          name="sellerBy"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.sellerBy}
                        />
                      </Box>
                      <Box>
                        <TextField
                          error={Boolean(touched.stock && errors.stock)}
                          fullWidth
                          helperText={touched.stock && errors.stock}
                          label="Stock"
                          margin="normal"
                          name="stock"
                          type="number"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.stock}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box>
                        <TextField
                          error={Boolean(touched.title && errors.title)}
                          fullWidth
                          helperText={touched.title && errors.title}
                          label="Title"
                          margin="normal"
                          name="title"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.title}
                        />
                      </Box>
                      <Box>
                        <TextField
                          error={Boolean(touched.discount && errors.discount)}
                          fullWidth
                          helperText={touched.discount && errors.discount}
                          label="Discount"
                          margin="normal"
                          name="discount"
                          type="number"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.discount}
                        />
                      </Box>
                      <Box>
                        <TextField
                          error={Boolean(
                            touched.retrunDayCount && errors.retrunDayCount
                          )}
                          fullWidth
                          helperText={
                            touched.retrunDayCount && errors.retrunDayCount
                          }
                          label="Return Day"
                          type="number"
                          margin="normal"
                          name="retrunDayCount"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.retrunDayCount}
                        />
                      </Box>
                      <Box>
                        <TextField
                          error={Boolean(touched.category && errors.category)}
                          fullWidth
                          helperText={touched.category && errors.category}
                          label="Category"
                          margin="normal"
                          name="category"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.category}
                        />
                      </Box>
                      <Box>
                        <TextField
                          error={Boolean(
                            touched.detailDescription &&
                              errors.detailDescription
                          )}
                          fullWidth
                          helperText={
                            touched.detailDescription &&
                            errors.detailDescription
                          }
                          label="Detail Description"
                          margin="normal"
                          name="detailDescription"
                          multiline
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.detailDescription}
                        />
                      </Box>
                      <Box>
                        <TextField
                          error={Boolean(touched.quantity && errors.quantity)}
                          fullWidth
                          helperText={touched.quantity && errors.quantity}
                          label="Quantity"
                          type="number"
                          margin="normal"
                          name="quantity"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.quantity}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Box>

                <Box alignItems="center" display="flex" ml={-1}>
                  <Checkbox
                    checked={values.policy}
                    name="policy"
                    onChange={handleChange}
                  />
                  <Typography color="textSecondary" variant="body1">
                    I have read the{' '}
                    <Link
                      color="primary"
                      component={RouterLink}
                      to="#"
                      underline="always"
                      variant="h6"
                    >
                      Terms and Conditions
                    </Link>
                  </Typography>
                </Box>
                {Boolean(touched.policy && errors.policy) && (
                  <FormHelperText error>{errors.policy}</FormHelperText>
                )}
                <Box my={2}>
                  <Button
                    color="primary"
                    // disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Sign up now
                  </Button>
                </Box>
                {/* <Typography
                  color="textSecondary"
                  variant="body1"
                >
                  Have an account?
                  {' '}
                  <Link
                    component={RouterLink}
                    to="/login"
                    variant="h6"
                  >
                    Sign in
                  </Link>
                </Typography> */}
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </Page>
  );
};

export default AddProduct;
