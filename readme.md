
# Description
## ZPACE - small workspace sharing platform


ZPACE aims to solve the problem of the need for individual workspaces and unused idle facilities. 
ZPACE provides a platform for hosts to share the operational cost of smallsized, unused facilities while services a community of modern and flexible professionals in need of swiftness, low-cost and comfort environment to be productive wherever they
work from.
The targeted users of ZPACE would be the flex community including freelance workers, students and design-art creator

![Thumbnail](https://raw.githubusercontent.com/KnrkTam/Zpace-1.0-old_version-/main/public/zpace.png)

# Major Features

- Criteria searching for workspaces with geolocation
- Booking rooms with a timeslot picker
- Real time chat room for owner-visitor communication
- Rating and Reviews
- Visualised rental statistics for room hosts


## Tech Stacks

- [React](https://reactjs.org/) (in TypeScript)
- [React Hooks](https://reactjs.org/docs/hooks-intro.html)
- [Redux](https://redux.js.org/)
- [Redux Thunk](https://github.com/reduxjs/redux-thunk)
- [Bootstrap 4.5.3](https://getbootstrap.com/docs/4.5/getting-started/introduction/)
- [Material-UI](https://mui.com/)
- [OAuth](https://developers.google.com/identity/protocols/oauth2)
- [Node.js](https://nodejs.org/en/) (in TypeScript)
- [Express](https://expressjs.com/) (RESTful API)
- [Knex](https://knexjs.org/guide/migrations.html) (Query Builder)
- [PostgreSQL](https://www.postgresql.org/)
- [Multer](https://www.npmjs.com/package/multer)
- [Paypal sandbox](https://developer.paypal.com/developer/accounts/)
- [Docker](https://www.docker.com/)
- [JSON Web Tokens](https://jwt.io/)
- [Socket.io](https://socket.io/)
- [GitLab](https://about.gitlab.com/) (CI/CD)
- [AWS](https://aws.amazon.com/) (EC2, S3, CloudFront, IAM, Route53)



## Client to Server flow
![Thumbnail](https://github.com/KnrkTam/Zpace-1.0-old_version-/blob/main/public/client_to_server_flow.png)

1. To manage the transformation of domain name and IP, Route 53 service is used.
2. CloudFront can accelerate the speed of websites to clients over the Internet while also reducing the load in different locations.
3. S3 Bucket is used to host the website and monitor who is accessing data.
4. Ubuntu instance is run on computers in EC2.
5. Nginx is to proxy service which takes a client request, passes it on NodeJS application.
6. Node.JS and express are used to build the server.
## Contributors

[//]: contributor-faces
<table>
<td>
<a href="https://github.com/KnrkTam"><img src="https://avatars.githubusercontent.com/u/99338991?s=96&v=4" title="Kenrick Tam" width="80" height="80"></a>
</td>


<td>

<a href="https://github.com/jimmywu987"><img src="https://avatars.githubusercontent.com/u/65562227?v=4" title="Jimmy Wu" width="80" height="80"></a>
</td>
</table>

<!-- <a href="https://github.com/knrktam/zpace/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=knrktam/zpace" />
</a> -->