const RedisStorage = require('./../lib/redis_storage')
const co = require('co')

describe("RedisStorage", function() {
  var storage, resource
  beforeEach(function*() {
    resource = { id: faker.random.uuid() }
    storage = new RedisStorage()
    yield storage.reset()
  })

  describe("add", function() {
    it ('returns empty array when no resources', function*() {
      var resources = yield storage.getAll()
      // expect(resources).to.be.empty
      expect(resources).to.deep.equal([])
    })

    it ('returns all resources', function*() {
      yield storage.add(resource)
      var resources = yield storage.getAll()
      expect(resources).to.deep.equal([resource])
    })
  })

  describe('add', function() {
    it ('fails if resource has no id', function*() {
      delete resource.id
      var add = co.wrap(storage.add).bind(storage)
      yield expect(add(resource))
        .to.be.rejectedWith(Error, 'Resource contains no id')
    })

    it ('adds the resource to the pool', function*() {
      yield storage.add(resource)
      expect(yield storage.getAll())
        .to.deep.equal([resource])
    })
  })

  describe('remove', function() {
    beforeEach(function*() {
      yield storage.add(resource)
    })

    it ('removes the resource from the pool', function*() {
      yield storage.remove(resource)
      expect(yield storage.getAll())
        .to.deep.equal([])
    })

    it ('accepts id', function*() {
      yield storage.remove(resource.id)
      expect(yield storage.getAll())
        .to.deep.equal([])
    })
  })

  describe('acquire', function() {
    it ('returns a resource', function*() {
      yield storage.add(resource)
      var r = yield storage.acquire()
      expect(r).to.deep.equal(resource)
    })

    it ('removes the resource from the pool', function*() {
      yield storage.add(resource)
      yield storage.acquire()
      expect(yield storage.getAll()).to.deep.equal([])
    })
  })

  describe('release', function() {
    it ('returns the resource to the pool', function*() {
      yield storage.add(resource)
      var res = yield storage.acquire()
      yield storage.release(res.id)
      expect(yield storage.getAll()).to.deep.equal([resource])
    })
  })
})