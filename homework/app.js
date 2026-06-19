var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var swaggerUi = require('swagger-ui-express');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api');

var app = express();

var swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Express Homework API',
    version: '1.0.0',
    description: 'API homework with Express, external APIs, CRUD and Swagger',
  },
  servers: [
    {
      url: 'http://localhost:3000',
    },
  ],
  paths: {
    '/api/summary': {
      get: {
        summary: 'Get combined data from external APIs',
        description: 'Returns one object with data from JSONPlaceholder and DummyJSON',
        responses: {
          200: {
            description: 'Combined external data',
          },
          500: {
            description: 'Server error',
          },
        },
      },
    },
    '/api/notes': {
      get: {
        summary: 'Get all notes',
        responses: {
          200: {
            description: 'List of notes',
          },
        },
      },
      post: {
        summary: 'Create note',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'text'],
                properties: {
                  title: {
                    type: 'string',
                    example: 'My note',
                  },
                  text: {
                    type: 'string',
                    example: 'Note text',
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Created note',
          },
          400: {
            description: 'Validation error',
          },
        },
      },
    },
    '/api/notes/{id}': {
      put: {
        summary: 'Update note',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'number',
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: {
                    type: 'string',
                    example: 'Updated title',
                  },
                  text: {
                    type: 'string',
                    example: 'Updated text',
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Updated note',
          },
          404: {
            description: 'Note not found',
          },
        },
      },
      delete: {
        summary: 'Delete note',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'number',
            },
          },
        ],
        responses: {
          200: {
            description: 'Deleted note',
          },
          404: {
            description: 'Note not found',
          },
        },
      },
    },
  },
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);

  if (req.originalUrl.startsWith('/api')) {
    return res.json({
      message: err.message || 'Server error',
    });
  }

  return res.render('error');
});

module.exports = app;