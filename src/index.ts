import { 
    GraphQLServer, 
    NoStacktraceJsonLogger 
} from '@dreamit/graphql-server'
import { 
    userSchema, 
    userSchemaResolvers 
} from '@dreamit/graphql-testing'
import express from 'express'
import bodyParser from 'body-parser'
import { 
    GraphQLServerRequest, 
    GraphQLServerResponse 
} from '@dreamit/graphql-server-base'
import { Server } from 'node:http'

export function startWebServer(): Server {
    const graphqlServer = new GraphQLServer(
        {
            schema: userSchema,
            rootValue: userSchemaResolvers,
            logger: new NoStacktraceJsonLogger('expressjs-server', 'user-service')
        }
    )
    
    const graphQLServerPort = 7070
    const graphQLServerExpress = express()
    graphQLServerExpress.use(bodyParser.text({type: '*/*'}))
    graphQLServerExpress.all('/graphql', 
        (request: GraphQLServerRequest, response: GraphQLServerResponse, next) => {
            graphqlServer.handleRequest(request, response).catch(next)
        })
    const server = graphQLServerExpress.listen({port: graphQLServerPort})
    console.info(`Starting GraphQL server on port ${graphQLServerPort}`)
    return server
}
