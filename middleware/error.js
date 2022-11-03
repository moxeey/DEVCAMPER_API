const ErrorResponse=require("../utils/errorResponse");

const errorHandler=(err,req,res,next) => {
  let error={...err};
  error.message=err.message;

  // Log for dev
  console.log(err.stack.red);

  //   Mongoose error
  if(err.name==="CastError") {
    const message=`Resource not found`;
    error=new ErrorResponse(message,404);
  }
  // Mongoose duplicate key
  if(err.code===11000) {
    const message=`Duplicate field value entered`;
    error=new ErrorResponse(message,400);
  }
  //   Mongoose validation error
  if(err.name==="ValidationError") {
    const message=Object.values(err.errors).map((val) => val.message);
    error=new ErrorResponse(message,400);
  }
  // Other server related error
  res.status(error.statusCode||500).send({
    success: false,
    error: error.message||"Server error",
  });
};

module.exports=errorHandler;
