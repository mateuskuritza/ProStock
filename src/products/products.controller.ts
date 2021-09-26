import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AddIngredientDto } from './dto/add-ingredient.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { localStorage } from './multerConfig';
@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }

  @Post('ingredient')
  addIngredient(@Body() addIngredientInfos: AddIngredientDto) {
    return this.productsService.addIngredient(addIngredientInfos);
  }

  @Post(':productId/image')
  @UseInterceptors(FileInterceptor('file', localStorage))
  uploadImage(
    @Param('productId') productId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.productsService.createOrUpdateImage(+productId, file);
  }

  @Get(':productId/image')
  findImage(@Param('productId') productId: string, @Res() res) {
    return this.productsService.findImage(+productId, res);
  }
}
